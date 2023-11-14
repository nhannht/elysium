import {useEffect, useRef, useState} from 'react'

import {ConvertMdToHTML, ReadFileFromDialog} from "../wailsjs/go/main/App";
import ReactCodeMirror, {EditorSelection, ReactCodeMirrorRef} from "@uiw/react-codemirror";
import {markdown,markdownLanguage} from "@codemirror/lang-markdown";
import {syntaxHighlighting, defaultHighlightStyle} from "@codemirror/language"
import {languages} from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim"
import {EditorView} from "@uiw/react-codemirror";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
function RenderView(
    {
        html
    }: {
        html: string
    }
) {

    return (
        <>
            <div className={"h-5/6 right-0 w-1/2 bg-neutral-100 absolute overflow-scroll"}>
                <div
                    className={"prose "}
                    dangerouslySetInnerHTML={{__html: html}}/>
            </div>
        </>
    )
}


function App() {
    const [markdownText, setMarkdownText] = useState("")
    const [html, setHtml] = useState("")
    const codeMirrorRef = useRef<ReactCodeMirrorRef>({});
    useEffect(()=> {
        hljs.highlightAll()
    })

    return (
        // TODO: add more buttons, auto save function, create new file, export, insert image, recenf file
        <div className={"h-screen w-screen relative"}>
            <div id={"editorContainer"}
                 className="w-1/2 mb-4 border border-gray-200 rounded-lg bg-white absolute flex flex-col dark:bg-gray-700 h-5/6 dark:border-gray-600">
                <ReactCodeMirror
                    id={"codeMirrorEditor"}
                    ref={codeMirrorRef}

                    onChange={async (value) => {
                       setMarkdownText(value)
                        const html = await ConvertMdToHTML(value)
                        setHtml(html)

                    }}
                    className={"h-full"}
                    extensions={[
                        vim(),
                        markdown({
                            base: markdownLanguage,
                            codeLanguages: languages,
                        }),
                        syntaxHighlighting(defaultHighlightStyle),
                        EditorView.lineWrapping

                    ]}
                    value={markdownText}
                />
            </div>

            <button
                className={"button bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full absolute " +
                    "bottom-0 left-1/2 -translate-x-1/2"}
                onClick={async () => {

                    const fileContent = await ReadFileFromDialog()
                    const view = codeMirrorRef.current?.view
                    view?.dispatch({
                        selection: EditorSelection.create([
                            EditorSelection.range(0, view?.state.doc.length),
                        ], 0),

                    })
                    view?.dispatch(view.state?.replaceSelection(fileContent))
                    setMarkdownText(fileContent)
                    const html = await ConvertMdToHTML(fileContent)
                    setHtml(html)

                }}>Open
            </button>
            <RenderView html={html}/>

        </div>
    )
}

export default App
