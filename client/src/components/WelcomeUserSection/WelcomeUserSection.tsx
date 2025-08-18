import { useCurrentUser } from "../../hooks/useCurrentUser";

const gradientStyles = `
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const sectionStyle = {
  background: "linear-gradient(270deg, #1e1e2e, #312e81, #18181b)",
  backgroundSize: "400% 400%",
  animation: "gradientMove 8s ease infinite",
  border: "1px solid rgba(255,255,255,0.1)"
};

export const WelcomeUserSection = () => {
  const { username } = useCurrentUser();
  if (!username) return null;
  return (
    <>
      <style>{gradientStyles}</style>
      <section
        className="w-full mx-auto rounded-2xl shadow-lg p-4 flex flex-col items-center text-center mb-10"
        style={sectionStyle}
      >
        <h2 className="text-xl font-semibold text-slate-200">
          ¡Hola, {username}!
        </h2>
      </section>
    </>
  )
}
