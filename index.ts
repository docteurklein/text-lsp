
import {
  createConnection,
  InitializeResult,
  TextDocumentSyncKind,
  TextDocuments,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

const connection = createConnection();

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        triggerCharacters: [""],
      },
    },
  };

  return result;
});

connection.onCompletion((params) => {
  const doc = documents.get(params.textDocument.uri);

  if (!doc) {
    return null;
  }

  const lines = doc.getText().split("\n");
  const items = Array.from(new Set(lines
    .flatMap((x) => x.split(" "))
    .filter(x => x.trim().length > 0)))
    .map(x => ({
      label: x,
      data: x,
    }))
  ;

  return {
    isIncomplete: true,
    items,
  };
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
