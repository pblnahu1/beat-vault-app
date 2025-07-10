import { useNavigate } from "react-router-dom"

interface ButtonGestionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    username: string;
    children?: React.ReactNode;
    className?: string;
}

export const ButtonGestion = ({
    username,
    children = "Gestioná tu cuenta",
    className = "",
    ...props
}: ButtonGestionProps) => {

const navigate = useNavigate();

  return (
    <button
        title="Gestioná tu cuenta"
        onClick={() => navigate(`/dashboard/${username}`)}
        className={`px-4 py-2 bg-blue-600 text-white rounded-3xl font-semibold shadow hover:bg-blue-700 transition-colors ${className}`}
        {...props}
    >
    {children}
    </button>
  )
}

