// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

/**
 * A wrapper around window.showOpenFilePicker that returns an empty array instead of throwing when
 * the user cancels the file picker.
 */
export default async function showOpenFilePicker(
  options?: OpenFilePickerOptions,
): Promise<FileSystemFileHandle[] /* foxglove-depcheck-used: @types/wicg-file-system-access */> {
  try {
    // return await window.showOpenFilePicker(options);
    window.document.getElementById("studio-file-input")?.remove();
    let input = window.document.createElement("input");
    input.type = "file";
    input.id = "studio-file-input";
    input.style.display = "none";
    if (options?.types) {
      input.accept = options.types.map((type) => type.accept?.["application/octet-stream"]).join(",");
    }
    window.document.body.appendChild(input);

    input = window.document.getElementById("studio-file-input") as HTMLInputElement;
    input.click();
    const files = await new Promise<FileList>((resolve, reject) => {
      input.onchange = () => {
        if (!input.files) {
          reject(new Error("No files selected"));
          return;
        }
        resolve(input.files);
      }
    });
    return Array.from(files).map(file => {
      // @ts-ignore
      return {
        getFile: async () => file,
        kind: "file",
        name: file.name,
        isDirectory: false,
        isFile: true,
        createSyncAccessHandle: () => Promise.resolve(),
        isSameEntry: () => false,
        queryPermission: () => Promise.resolve("granted"),
        requestPermission: () => Promise.resolve("granted"),
        removeEntry: () => Promise.resolve(),
        createWritable: () => Promise.resolve({
          write: async (data: any) => {
            const blob = new Blob([data]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
          },
          close: () => Promise.resolve(),
          seek: () => Promise.resolve(),
          truncate: () => Promise.resolve(),
          locked: false,
          abort: () => Promise.resolve(),
          getWriter: () => Promise.resolve(),
        }),
      } as FileSystemFileHandle;
    });

  } catch (err) {
    if (err.name === "AbortError") {
      return [];
    }
    throw err;
  }
}
