import { prompts } from "@lilith-plat/utils";

// the definition is copied from prompts.d.ts; if there is a better way to do this, tell me.
export function promptsExitWhenCancel<T extends string = string>(
  questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>,
  options?: Pick<prompts.Options, "onSubmit">
): Promise<prompts.Answers<T>> {
  return prompts(questions, {
    ...options,
    onCancel: () => {
      process.exit(1);
    },
  });
}
