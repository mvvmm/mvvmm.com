"use client";

import { getSrcDoc } from "@/data/getSrcDoc";
import { ScriptContext } from "@/types/script";
import { createContext, ReactNode, useContext, useState } from "react";

const scriptContext = createContext({} as ScriptContext);

export const ScriptProvider = ({
  script,
  css,
  children,
}: {
  script: string;
  css: string;
  children: Readonly<ReactNode>;
}) => {
  const [_script, setScript] = useState(script);
  const [_css, setCss] = useState(css);
  const srcDoc = getSrcDoc({ script: _script, css: _css });

  const updateScript = (script: string) => {
    setScript(script);
  };

  return (
    <scriptContext.Provider
      value={{ script: _script, srcDoc, css, updateScript }}
    >
      {children}
    </scriptContext.Provider>
  );
};

export const useScript = () => {
  return useContext(scriptContext);
};
