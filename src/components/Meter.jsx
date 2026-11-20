export default function Meter({ label, value, kind }) {
  return (
    <div className={`meter ${kind}`}>
      <div className="meter-top">
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <div className="meter-bar"><i style={{ width: `${value}%` }} /></div>
    </div>
  );
}
