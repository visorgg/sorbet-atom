'use babel'

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom'
import ServiceClient from "./service_client"

let service = null;
let provider = null;

module.exports = {
  activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.workspace.observeTextEditors((editor) => {
      editor.onDidSave((args) => {
        if (args.path.match(new RegExp(atom.config.get('ide-sorbet.fileExtensionMatcher')))) {
          this.check();
        }
      });
    }))

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'sorbet:check': this.check,
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  consumeSignal(registry) {
    provider = registry.create();
    this.subscriptions.add(provider);
  },

  check() {
    if (service) {
      return;
    }
    provider && provider.add('Running Sorbet');
    service = ServiceClient.check();
    service.stderr.on('data', (data) => {
      message = data.toString();
      if (!message.includes("No errors")) {
        atom.notifications.addWarning(message, {});
      }
    });
    service.on('close', (code) => {
      provider && provider.clear();
      service = null;
    });
  }
}
