export type TModalActions = "ACCOUNT" | "LOCATION" | "CLOSE";

export type TModalData = {
  zipCode?: string;
}

export type TModalState = {
    type: TModalActions | null;
    data: TModalData;
    isOpen: boolean;
  };

export type TModalContext = TModalState & {
    onOpen: (type: TModalActions, data: TModalData) => void;
    onClose: () => void;
}