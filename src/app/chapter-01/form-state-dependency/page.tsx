"use client";

import { useEffect, useReducer, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/CodeBlock";

type Mode = "useState" | "useReducer";

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ReducerState extends FormState {
  canSubmit: boolean;
}

export default function FormStateDependency() {
  const [mode, setMode] = useState<Mode>("useState");

  // ---------- useState 解法 ----------
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    const isValid =
      username.trim() !== "" &&
      email.includes("@") &&
      password.length >= 6 &&
      password === confirmPassword;
    setCanSubmit(isValid);
  }, [username, email, password, confirmPassword]);

  const stateCode = `const [username, setUsername] = useState("")
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")

useEffect(() => {
  setCanSubmit(
    username.trim() !== "" &&
    email.includes("@") &&
    password.length >= 6 &&
    password === confirmPassword
  )
}, [username, email, password, confirmPassword])
`;

  // ---------- useReducer 解法 ----------
  type Action = { type: "SET_FIELD"; field: keyof FormState; payload: string };

  const initialReducerState: ReducerState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    canSubmit: false,
  };

  const validateForm = (state: FormState): boolean => {
    return (
      state.username.trim() !== "" &&
      state.email.includes("@") &&
      state.password.length >= 6 &&
      state.password === state.confirmPassword
    );
  };

  const reducer = (state: ReducerState, action: Action): ReducerState => {
    if (action.type === "SET_FIELD") {
      const newState = {
        ...state,
        [action.field]: action.payload,
      };
      return {
        ...newState,
        canSubmit: validateForm(newState),
      };
    }
    return state;
  };

  const [reducerState, dispatch] = useReducer(reducer, initialReducerState);

  const reducerCode = `function validateForm(state) {
  return (
    state.username.trim() !== "" &&
    state.email.includes("@") &&
    state.password.length >= 6 &&
    state.password === state.confirmPassword
  )
}

function reducer(state, action) {
  if (action.type === "SET_FIELD") {
    const newState = { ...state, [action.field]: action.payload }
    return {
      ...newState,
      canSubmit: validateForm(newState)
    }
  }
  return state
}`;

  // 共用輸出與 onChange
  const formData =
    mode === "useState"
      ? { username, email, password, confirmPassword }
      : reducerState;
  const submitStatus = mode === "useState" ? canSubmit : reducerState.canSubmit;

  const onChange =
    mode === "useState"
      ? (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          switch (name) {
            case "username":
              setUsername(value);
              break;
            case "email":
              setEmail(value);
              break;
            case "password":
              setPassword(value);
              break;
            case "confirmPassword":
              setConfirmPassword(value);
              break;
          }
        }
      : (e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch({
            type: "SET_FIELD",
            field: e.target.name as keyof FormState,
            payload: e.target.value,
          });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        1.9 - 複雜表單：彼此依賴的 state 管理該怎麼做？
      </h1>

      <div className="flex gap-2">
        <Button
          variant={mode === "useState" ? "default" : "outline"}
          onClick={() => setMode("useState")}
        >
          useState 模式
        </Button>
        <Button
          variant={mode === "useReducer" ? "default" : "outline"}
          onClick={() => setMode("useReducer")}
        >
          useReducer 模式
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={onChange}
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={onChange}
          />
          <Button disabled={!submitStatus}>提交</Button>

          <div className="mt-4 p-2 border rounded">
            <p className="text-sm font-medium">目前狀態（{mode}）：</p>
            <pre className="text-xs">
              {JSON.stringify(
                { ...formData, canSubmit: submitStatus },
                null,
                2
              )}
            </pre>
          </div>
        </CardContent>
      </Card>

      {mode === "useState" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="font-semibold">useState + useEffect 範例</p>
            <CodeBlock code={stateCode} />
          </CardContent>
        </Card>
      )}

      {mode === "useReducer" && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="font-semibold">useReducer 範例</p>
            <CodeBlock code={reducerCode} />
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground">
        當表單欄位越多，<code>useState</code> 難以集中管理時，
        <code>useReducer</code> 能帶來更清晰、彈性的狀態處理結構。
      </p>
    </div>
  );
}
