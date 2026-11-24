"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Check,
  Pencil,
  Sparkles,
  Trash2,
  UsersRound,
  WandSparkles,
  X,
} from "lucide-react";
import type { Project } from "../projectData";
import styles from "./ai-task-generator.module.css";
import { generateAiTasks } from "../../services/aiService";

type Priority = "High" | "Medium" | "Low";

type SuggestedTask = {
  id: string;
  title: string;
  description: string;
  priority?: Priority;
  assignee: string;
};

type TaskDraft = {
  title: string;
  description: string;
  priority: Priority | "";
};

type Employee = {
    id: string;
    name: string;
};

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export type AISaveTask = {
  title: string,
  description: string,
  assignee: string
}

export default function AITaskGenerator({project,teamId,employees,onClose, onSaveTasks}: {
  project: Project;
  teamId: string;
  employees: Employee[];
  onClose: () => void;
  onSaveTasks: (tasks: AISaveTask[]) => Promise<void>;
}) {
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TaskDraft | null>(null);
  const [notice, setNotice] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false); //tracks whether Groq is currently generating tasks.
  const [isSaving, setIsSaving] = useState(false);
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const selectedCount = selectedIds.length;
  const allSelected =
    suggestions.length > 0 && selectedCount === suggestions.length;

  // Generate Task
  async function generateTasks() {
    try {
      setIsGenerating(true);
      setNotice("");
      const tasks = await generateAiTasks(teamId, project._id);

      const nextSuggestions = tasks.map((task, index) => ({
        id: `${Date.now()}-${index}`,
        title: task.title,
        description: task.description,
        assignee: "",
      }));

      setSuggestions(nextSuggestions); // Add that suggestions
      setSelectedIds(nextSuggestions.map((task) => task.id)); // TO take ou all the task ids
      setHasGenerated(true); // Loading state
      setEditingId(null); // Closes any previously opened edit form.
      setDraft(null); // Clears temporary editing data.

      setNotice("AI suggestions generated successfully!"); // Displays a success notification in your modal.
    } catch (err) {
      console.log("Ai Task Generation Failed", err);
      setNotice("Unable to generate tasks. Please try again");
    } finally {
      setIsGenerating(false);
    }
  }

  function toggleTask(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds(allSelected ? [] : suggestions.map((task) => task.id));
  }

  function beginEditing(task: SuggestedTask) {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      description: task.description,
      priority: task.priority ?? "",
    });
  }

  function saveEdit(id: string) {
    if (!draft?.title.trim()) return;
    setSuggestions((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              title: draft.title.trim(),
              description: draft.description,
              priority: draft.priority || undefined,
            }
          : task,
      ),
    );
    setEditingId(null);
    setDraft(null);
  }

  function deleteSuggestion(id: string) {
    setSuggestions((current) => current.filter((task) => task.id !== id));
    setSelectedIds((current) =>
      current.filter((selectedId) => selectedId !== id),
    );
    if (editingId === id) {
      setEditingId(null);
      setDraft(null);
    }
  }

  async function previewAddSelected() {
    const selectedTasks = suggestions.filter((task) => selectedIds.includes(task.id))
      .map(({ title, description, assignee }) => ({ title, description, assignee }));

    if (!selectedTasks.length) {
      setNotice("Select at least one task to add.");
      return;
    }

    // If did nt assign the assigned to person or employee
    const unassignedTasks = selectedTasks.filter(
      (task)=> !task.assignee
    )

    if(unassignedTasks.length>0){
      setNotice("Please assign an employee o every selected task.");
      return 
    }

    try {
      await onSaveTasks(
        selectedTasks.map((task)=>({
          title: task.title,
          description: task.description,
          assignee: task.assignee
        }))
      )

      setNotice("Tasks saved successfully!");
      onClose();

    } catch (error) {
      console.error("Could not add selected AI tasks", error);
      setNotice("Unable to add tasks. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isMounted) return null;

  return createPortal((
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-task-title"
        aria-describedby="ai-task-subtitle"
      >
        <header className={styles.header}>
          <div className={styles.headingIcon} aria-hidden="true">
            <Sparkles size={19} />
          </div>
          <div className={styles.headingText}>
            <div className={styles.eyebrow}>
              RED SUN INTELLIGENCE
            </div>
            <h2 id="ai-task-title">AI Task Generator</h2>
            <p id="ai-task-subtitle">
              Generate an actionable task plan for your project.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close task generator"
          >
            <X size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <section
            className={styles.projectContext}
            aria-label="Project context"
          >
            <div className={styles.contextTopline}>
              <span className={styles.contextLabel}>PROJECT CONTEXT</span>
              <span className={styles.contextProject}>
                <span /> {project.name}
              </span>
            </div>
            <p>
              {project.description?.trim() ||
                "No project description has been added yet."}
            </p>
          </section>

          <section
            className={styles.generateCard}
            aria-label="Generate task suggestions"
          >
            <div className={styles.generateCopy}>
              <span className={styles.generateIcon}>
                <WandSparkles size={17} />
              </span>
              <div>
                <h3>Turn your project into a clear plan</h3>
                <p>
                  Generate a tailored task plan, then review and adjust each
                  suggestion.
                </p>
              </div>
            </div>
            <button
              type="button"
              className={styles.generateButton}
              onClick={generateTasks}
              disabled={isGenerating}
            >
              <Sparkles size={15} />
              {isGenerating
                ? "Generating..."
                : hasGenerated
                  ? "Generate Again"
                  : "Generate Tasks"}
            </button>
          </section>

          <div className={styles.listHeading}>
            <div>
              <h3>Suggested tasks</h3>
              <p>
                {suggestions.length
                  ? `${suggestions.length} ideas for this project`
                  : "Your task plan will appear here"}
              </p>
            </div>
            {suggestions.length > 0 && (
              <button
                type="button"
                className={styles.selectAll}
                onClick={toggleAll}
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            )}
          </div>

          {suggestions.length ? (
            <div className={styles.taskList}>
              {suggestions.map((task) => {
                const isSelected = selectedIds.includes(task.id);
                const isEditing = editingId === task.id;

                return (
                  <article
                    className={`${styles.taskCard} ${isSelected ? styles.taskCardSelected : ""}`}
                    key={task.id}
                  >
                    <div className={styles.taskTop}>
                      <label
                        className={styles.checkboxWrap}
                        aria-label={`Select ${task.title}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleTask(task.id)}
                        />
                        <span className={styles.customCheck}>
                          <Check size={12} />
                        </span>
                      </label>

                      <div className={styles.taskContent}>
                        {isEditing && draft ? (
                          <div className={styles.editFields}>
                            <label>
                              <span>Task title</span>
                              <input
                                value={draft.title}
                                onChange={(event) =>
                                  setDraft({
                                    ...draft,
                                    title: event.target.value,
                                  })
                                }
                                autoFocus
                              />
                            </label>
                            <label>
                              <span>Description</span>
                              <textarea
                                rows={2}
                                value={draft.description}
                                onChange={(event) =>
                                  setDraft({
                                    ...draft,
                                    description: event.target.value,
                                  })
                                }
                              />
                            </label>
                            <label className={styles.priorityField}>
                              <span>Priority</span>
                              <select
                                value={draft.priority}
                                onChange={(event) =>
                                  setDraft({
                                    ...draft,
                                    priority: event.target.value as Priority | "",
                                  })
                                }
                              >
                                <option value="">No priority</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                              </select>
                            </label>
                            <div className={styles.editActions}>
                              <button
                                type="button"
                                className={styles.inlineCancel}
                                onClick={() => {
                                  setEditingId(null);
                                  setDraft(null);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className={styles.inlineSave}
                                onClick={() => saveEdit(task.id)}
                              >
                                Save task
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={styles.taskTitleRow}>
                              <h4>{task.title}</h4>
                              {task.priority && (
                                <span
                                  className={`${styles.priority} ${styles[`priority${task.priority}`]}`}
                                >
                                  {task.priority}
                                </span>
                              )}
                            </div>
                            <p className={styles.taskDescription}>
                              {task.description}
                            </p>
                          </>
                        )}
                      </div>

                      {!isEditing && (
                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            onClick={() => beginEditing(task)}
                            aria-label={`Edit ${task.title}`}
                            title="Edit task"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSuggestion(task.id)}
                            aria-label={`Delete ${task.title}`}
                            title="Delete suggestion"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <label className={styles.assigneeField}>
                        <span>
                          <UsersRound size={13} /> Assign to
                        </span>
                        <select
                          value={task.assignee}
                          onChange={(event) =>
                            setSuggestions((current) =>
                              current.map((item) =>
                                item.id === task.id
                                  ? { ...item, assignee: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          aria-label={`Assign ${task.title}`}
                        >
                          <option value="">Unassigned</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <Sparkles size={20} />
              </span>
              <h4>
                {hasGenerated
                  ? "All suggestions cleared"
                  : "Ready when you are"}
              </h4>
              <p>
                {hasGenerated
                  ? "Generate another task plan whenever you want."
                  : "Generate a task plan from this project's details."}
              </p>
              <button
                    type="button"
                    className={styles.emptyGenerate}
                    onClick={generateTasks}
                    disabled={isGenerating}
                >
                    <Sparkles size={14} />
                    {isGenerating ? "Generating..." : "Generate Tasks"}
                </button>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerInfo}>
            <span className={styles.selectedCount}>
              <span>{selectedCount}</span> selected
            </span>
            <span className={styles.localNote}>
              Selected tasks will be added to this project
            </span>
            {notice && (
              <span className={styles.notice} role="status">
                {notice}
              </span>
            )}
          </div>
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.addButton}
              onClick={previewAddSelected}
              disabled={!selectedCount || isSaving}
            >
              {isSaving ? "Adding tasks…" : "Add Selected Tasks"}
              {!isSaving && <ArrowRight size={15} />}
            </button>
          </div>
        </footer>
      </section>
    </div>
  ), document.body);
}
