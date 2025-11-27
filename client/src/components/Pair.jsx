export default function Pair(props) {

  return (
    <div className="group relative">
      <div className="h-15 flex items-center justify-center text-2xl rounded-xl shadow bg-slate-100">
        <p>{props.number}: {props.emoji}</p>
      </div>
      <div className="absolute bg-white/90 border-2 border-solid border-black/20 rounded-2xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
        <p>{props.explanation}</p>
      </div>

    </div>
  )
}

/*
Tailwind position (relative and absolute)
see here: https://tailwindcss.com/docs/position

Hover:
z-50: make hovered text on top of stack
pointer-events-none: disable the hover text's own hover trigger
*/