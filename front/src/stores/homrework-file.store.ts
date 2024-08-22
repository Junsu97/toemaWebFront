import { create } from "zustand";

interface HomeworkFileStore{
    homeworkFiles: File[];
    addHomeworkFile: (file:File) => void;
    removeHomeworkFile: (fileName: string) => void;
    resetHomeworkFiles: () => void;
}

const useHomeworkFileStore = create<HomeworkFileStore>((set) => ({
    homeworkFiles: [],
    addHomeworkFile: (file) =>
        set((state) => ({
            homeworkFiles: [...state.homeworkFiles, file],
        })),
    removeHomeworkFile: (fileName) =>
        set((state) => ({
            homeworkFiles: state.homeworkFiles.filter((file) => file.name !== fileName),
        })),
    resetHomeworkFiles: () => set({ homeworkFiles: [] }),
}));

export default useHomeworkFileStore;