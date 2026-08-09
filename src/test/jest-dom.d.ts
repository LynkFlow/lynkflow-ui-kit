// Pulls in @testing-library/jest-dom's matcher type augmentation
// (toBeInTheDocument(), toHaveAttribute(), toBeDisabled(), ...) for every
// test file typechecked under src/. The runtime registration of these
// matchers happens separately via jest.setup.ts's `import
// "@testing-library/jest-dom"` (setupFilesAfterEnv) — this file exists
// purely so `tsc` sees the augmented types too.
//
// Deliberately not referenced via tsconfig's "types" array: that option
// only resolves packages published under node_modules/@types
// (typeRoots), and @testing-library/jest-dom ships its own bundled
// types instead — listing it there produces "Cannot find type
// definition file for '@testing-library/jest-dom'".
import "@testing-library/jest-dom";
