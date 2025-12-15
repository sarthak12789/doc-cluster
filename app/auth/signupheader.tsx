import Logo from "../assets/logo.svg";
export default function SignupHeader() {
  return (
    <div className="  hidden sm:flex justify-end mt-7 gap-1.5">

      {/* ✅ DocCluster */}
      <img src={Logo.src} className="inline-block"/>
      <h1 className="
        text-[#018FFF]
        text-[24px]
        font-normal
        text-center
        
      " style={{ fontFamily: "var(--font-nico)" }}>
        Doc<span className="text-[#000000]">Cluster</span>
      </h1>

    </div>
  );
}
