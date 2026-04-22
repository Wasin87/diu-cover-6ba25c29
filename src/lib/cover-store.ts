import { useSyncExternalStore } from "react";
import type { CoverData, CoverType } from "@/components/CoverPage";

type State = {
  selected: CoverType | null;
  form: Omit<CoverData, "type">;
  generated: CoverData | null;
};

const emptyForm: Omit<CoverData, "type"> = {
  semester: "",
  studentName: "",
  studentId: "",
  batch: "",
  section: "",
  courseCode: "",
  courseName: "",
  teacherName: "",
  designation: "",
  submissionDate: "",
};

let state: State = { selected: null, form: emptyForm, generated: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const coverStore = {
  get: () => state,
  setSelected(t: CoverType | null) {
    state = { ...state, selected: t };
    emit();
  },
  setForm(f: Omit<CoverData, "type">) {
    state = { ...state, form: f };
    emit();
  },
  updateField(k: keyof Omit<CoverData, "type">, v: string) {
    state = { ...state, form: { ...state.form, [k]: v } };
    emit();
  },
  setGenerated(g: CoverData | null) {
    state = { ...state, generated: g };
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useCoverStore() {
  return useSyncExternalStore(
    coverStore.subscribe,
    coverStore.get,
    coverStore.get,
  );
}
