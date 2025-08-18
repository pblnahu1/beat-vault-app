import { Link } from 'react-router-dom';
import { ButtonGestion } from '../UI/Buttons/ButtonGestionProps';
import { LogoutButton } from '../UI/Buttons/LogoutButton';
import { UserCog2 } from 'lucide-react';

export const AccountActions = ({ token, username, onClose }: {
    token: string | null,
    username?: string | null | undefined,
    onClose?: () => void
}) => (
    token && username ? (
        <>
            <ButtonGestion username={username} className="ml-2" children="Gestioná tu cuenta" />
            <LogoutButton />
        </>
    ) : (
        <Link
            to="/api/auth"
            className="flex items-center gap-2 text-slate-50 hover:text-slate-400"
            onClick={onClose}
        >
            <UserCog2 />
            <span>Cuenta</span>
        </Link>
    )
)
