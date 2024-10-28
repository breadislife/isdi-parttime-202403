import { create } from 'zustand';

export const useControllerStore = create(set => ({
   abortController: null,

   // Sets a new abort controller
   setAbortController: controller => set({ abortController: controller })
}));

export const useAbortController = () => {
   const { abortController, setAbortController } = useControllerStore();

   const abortCurrentAbortController = () => {
      if (abortController) abortController.abort();
   };

   const createNewAbortController = () => {
      const controller = new AbortController();

      setAbortController(controller);
   };

   return { abortCurrentAbortController, createNewAbortController };
};
