'use babel'

import cp from 'child_process';

class ServiceClient {

  check() {
    return cp.spawn(this.command(), this.args())
  }

  command() {
    return this.commandParts()[0]
  }

  args() {
    let args = this.commandParts().slice(1)

    args.push('tc')
    if (atom.config.get('ide-sorbet.verbose')) {
      args.push('-v')
    }

    return args
  }

  commandParts() {
    return atom.config.get('ide-sorbet.sorbetCommand').split(' ')
  }
}

module.exports = new ServiceClient()
