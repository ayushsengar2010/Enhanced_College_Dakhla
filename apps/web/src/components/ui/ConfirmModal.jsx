import { useState } from "react";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "primary"
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "🗑️",
      buttonBg: "bg-rose-600 hover:bg-rose-700",
      border: "border-rose-200",
      bg: "bg-rose-50",
    },
    warning: {
      icon: "⚠️",
      buttonBg: "bg-amber-500 hover:bg-amber-600",
      border: "border-amber-200",
      bg: "bg-amber-50",
    },
    primary: {
      icon: "ℹ️",
      buttonBg: "bg-[#c58237] hover:bg-[#b0712a]",
      border: "border-amber-300",
      bg: "bg-amber-50/50",
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-fadeIn">
        <div className={`${style.bg} rounded-xl p-4 text-center border ${style.border}`}>
          <div className="text-4xl mb-2">{style.icon}</div>
          <h3 className="text-lg font-black text-navy">{title}</h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">{message}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer ${style.buttonBg}`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to use ConfirmModal more easily
 * Usage: const { confirm, ConfirmModalComponent } = useConfirm();
 *        const result = await confirm({ message: "Delete this?" });
 *        if (result) { doDelete(); }
 */
export function useConfirm() {
  const [state, setState] = useState({
    isOpen: false,
    resolve: null,
    config: {},
  });

  const confirm = (config = {}) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        resolve,
        config,
      });
    });
  };

  const handleConfirm = () => {
    state.resolve(true);
    setState({ isOpen: false, resolve: null, config: {} });
  };

  const handleCancel = () => {
    state.resolve(false);
    setState({ isOpen: false, resolve: null, config: {} });
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={state.isOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      {...state.config}
    />
  );

  return { confirm, ConfirmModalComponent };
}

export default ConfirmModal;
