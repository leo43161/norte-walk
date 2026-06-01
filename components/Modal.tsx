"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabelledBy?: string;
  children: React.ReactNode;
  closeLabel?: string;
}

/**
 * Modal genérico sobre `<dialog>` nativo de HTML5.
 *
 * Beneficios sobre montar un overlay propio:
 *  - Focus trap automático (el browser maneja Tab dentro del dialog).
 *  - ESC cierra y dispara `close` event.
 *  - Render encima del top-layer (no compite con z-index del resto).
 *  - Accesibilidad nativa (role=dialog, aria-modal).
 *
 * Sincronización: el ref controla showModal()/close() en respuesta a `open`.
 * El listener de `close` re-notifica al parent (cubre ESC y close X programático).
 *
 * Backdrop click: cuando el target del click es el propio <dialog>, cierra.
 * Esto funciona porque al hacer click en hijos, el target es el hijo y la
 * comparación es falsa (no se cierra).
 */
export default function Modal({
  open,
  onClose,
  ariaLabelledBy,
  children,
  closeLabel = "Cerrar",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sincroniza el estado React con el método imperativo del dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Evita scroll del body cuando el modal está abierto.
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC nativo + close() programático disparan `close`; lo bridgeamos al parent.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => onClose();
    dialog.addEventListener("close", handler);
    return () => dialog.removeEventListener("close", handler);
  }, [onClose]);

  function onClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={ariaLabelledBy}
      onClick={onClick}
      className="
        m-0 h-full max-h-full w-full max-w-full p-0
        bg-(--color-background) text-(--color-foreground)
        md:m-auto md:h-auto md:max-h-[90vh] md:w-[min(100%,56rem)] md:rounded-2xl md:shadow-2xl
        backdrop:bg-(--color-stone-900)/60 backdrop:backdrop-blur-sm
        open:flex open:flex-col
      "
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="
          absolute right-3 top-3 z-10
          flex h-9 w-9 items-center justify-center rounded-full
          bg-(--color-surface) text-(--color-ink-700)
          shadow-sm ring-1 ring-(--color-border)
          hover:bg-(--color-bone-200) hover:text-(--color-foreground)
        "
      >
        <span aria-hidden className="text-lg leading-none">×</span>
      </button>
      <div className="max-h-full flex-1 overflow-y-auto">{children}</div>
    </dialog>
  );
}
