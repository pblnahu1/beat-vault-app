import { FC } from "react";
import { ErrorDisplayProps } from "../../types/orders";

export const ErrorDisplay: FC<ErrorDisplayProps> = ({ error }) => (
  <div className="text-center py-12">
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
      <p className="text-red-400">{error}</p>
    </div>
  </div>
);