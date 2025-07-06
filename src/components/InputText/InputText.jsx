import { useEffect, useRef, useState } from "react";
import useStore from "@/store/store.js";

function InputText() {
  const { inputText } = useStore();
  const inputTextRef = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    if (inputTextRef.current) {
      const inputTextHeight = inputTextRef.current.offsetHeight;
      window.popover.style.height = `${inputTextHeight + 25 + 69}px`;
    }
  }, [inputText]);

  return <div ref={inputTextRef}>{inputText}</div>;
}

export default InputText;
