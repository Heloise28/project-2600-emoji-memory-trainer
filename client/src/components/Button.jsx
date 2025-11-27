

export default function Button(props) {
  const color = props.color || "bg-[#5467ab]";
  // can't do hover:${colorHover}, becuse tailwind by default doesn't support this way, must input a class in full
  const colorHover = props.colorHover || "hover:bg-[#6576b3]";
  const textColor = props.textColor || "text-white";
  return (
    <button
      type={props.type}
      className={`text-2xl p-3 ${color} ${colorHover} ${textColor} rounded-2xl hover:shadow-md/20`}
      onClick={() => props.onClick()}
    >
      {props.text}
    </button>
  )
}


