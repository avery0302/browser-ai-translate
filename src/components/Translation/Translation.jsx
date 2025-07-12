import { useEffect, useRef, useState } from "react";
import useStore from "@/store/store.js";

function Translation() {
  const { translation } = useStore();
  const translationRef = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    if (translationRef.current && window.popover) {
      const translationHeight = translationRef.current.offsetHeight;
      const popoverHeight = parseInt(window.popover.style.height, 10);
      window.popover.style.height = `${popoverHeight - 25 + translationHeight}px`;
    }
  }, [translation]);

  return <div ref={translationRef}>{translation}</div>;
}

export default Translation;
