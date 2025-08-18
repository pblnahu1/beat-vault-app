import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { dashboardAuth } from "../../../content/dashboardAuth";

export default function DashboardAuth() {
  const {
    title,
    subtitle,
    paragraph,
    linkRegister,
    linkLogin,
    registerBtn,
    loginBtn,
    finalParagraph
  } = dashboardAuth; // solo me traigo el contenido

  const renderIcon = (): React.ReactNode => {
    return (
      <UserPlus size={64} className="text-indigo-200 mb-4 drop-shadow-lg" />
    );
  };

  const renderTitle = (): React.ReactNode => {
    return (
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-50 uppercase">
        {title}
      </h1>
    );
  };

  const renderSubtitle = (): React.ReactNode => {
    return (
      <h2 className="text-lg md:text-2xl text-yellow-400 mb-6 font-medium">
        {subtitle}
      </h2>
    );
  };

  const renderDescription = (): React.ReactNode => {
    return (
      <p className="text-gray-300 mb-10 text-lg">
        {paragraph}
      </p>
    );
  };

  const renderRegisterButton = (): React.ReactNode => {
    return (
      <Link
        to={linkRegister}
        className="bg-blue-600 text-slate-50 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        {registerBtn}
      </Link>
    );
  };

  const renderLoginButton = (): React.ReactNode => {
    return (
      <Link
        to={linkLogin}
        className="border border-slate-100 text-slate-50 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        {loginBtn}
      </Link>
    );
  };

  const renderActionButtons = (): React.ReactNode => {
    return (
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {renderRegisterButton()}
        {renderLoginButton()}
      </div>
    );
  };

  const renderFooterText = (): React.ReactNode => {
    return (
      <p className="text-xs text-gray-400 max-w-xs mx-auto my-5">
        {finalParagraph}
      </p>
    );
  };

  const renderContent = (): React.ReactNode => {
    return (
      <div className="w-[1300px] h-[520px] md:h-[600px] mx-auto flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-700 via-indigo-900 to-blue-950 rounded-3xl shadow-lg px-20">
        {renderIcon()}
        {renderTitle()}
        {renderSubtitle()}
        {renderDescription()}
        {renderActionButtons()}
        {renderFooterText()}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {renderContent()}
    </div>
  );
}