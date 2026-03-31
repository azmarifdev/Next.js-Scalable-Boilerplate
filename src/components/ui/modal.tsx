"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
}

export function Modal({ isOpen, title, description, onClose, children }: ModalProps): ReactNode {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="card modal-card">
        <h3 className="card-title">{title}</h3>
        {description ? <p className="card-subtitle">{description}</p> : null}
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
