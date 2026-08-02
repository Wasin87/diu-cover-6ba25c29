import { useSyncExternalStore } from "react";
import type { CoverData, CoverType } from "@/components/CoverPage";

export type ExtraImage = { id: string; dataUrl: string; name: string };

type State = {
  selected: CoverType | null;
  titleVariant: string;
  form: Omit<CoverData, "type" | "titleVariant">;
  extraText: string;
  images: ExtraImage[];
  generated: (CoverData & { extraText: string; images: ExtraImage[] }) | null;
};

const emptyForm: Omit<CoverData, "type" | "titleVariant"> = {
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

let state: State = {
  selected: null,
  titleVariant: "",
  form: emptyForm,
  extraText: "",
  images: [],
  generated: null,
};
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
  setExtraText(t: string) {
    state = { ...state, extraText: t };
    emit();
  },
  addImages(imgs: ExtraImage[]) {
    state = { ...state, images: [...state.images, ...imgs] };
    emit();
  },
  removeImage(id: string) {
    state = { ...state, images: state.images.filter((i) => i.id !== id) };
    emit();
  },
  clearImages() {
    state = { ...state, images: [] };
    emit();
  },
  setGenerated(g: State["generated"]) {
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
