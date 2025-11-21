import * as vscode from 'vscode';
import * as fs from 'fs';
import { REGEX_PRESETS, RegexPreset } from '../presets/RegexPresets';
import { Project } from '../common/Interfaces';
import { validateRegex } from '../util/ProjectUtils';

export class PresetCommands {

  /**
   * Preset selection command
   * User selects preset via Quick Pick and it's automatically added to settings.json
   */
  static async selectPreset(): Promise<void> {
    try {
      // 1. Select preset
      const selectedPreset = await this.showPresetPicker();
      if (!selectedPreset) {
        return; // User cancelled
      }

      // 2. Enter rootPath
      const rootPath = await this.promptForRootPath();
      if (!rootPath) {
        return; // User cancelled
      }

      // 3. Add to settings.json
      await this.addPresetToSettings(selectedPreset, rootPath);

      vscode.window.showInformationMessage(
        `VS-Linker: "${selectedPreset.name}" preset added successfully.`
      );

    } catch (error) {
      vscode.window.showErrorMessage(
        `VS-Linker: Error adding preset. ${error}`
      );
    }
  }

  /**
   * Show preset picker UI
   */
  private static async showPresetPicker(): Promise<RegexPreset | undefined> {
    const items: vscode.QuickPickItem[] = REGEX_PRESETS.map(preset => ({
      label: preset.name,
      description: preset.id,
      detail: `${preset.description}\nExample: ${preset.examples[0]}`
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a regex preset',
      matchOnDescription: true,
      matchOnDetail: true
    });

    if (!selected) {
      return undefined;
    }

    return REGEX_PRESETS.find(preset => preset.id === selected.description);
  }

  /**
   * Prompt for rootPath input
   */
  private static async promptForRootPath(): Promise<string | undefined> {
    // Suggest workspace path as default if available
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const defaultPath = workspaceFolders && workspaceFolders.length > 0
      ? workspaceFolders[0].uri.fsPath
      : '';

    const rootPath = await vscode.window.showInputBox({
      prompt: 'Enter project root path',
      value: defaultPath,
      placeHolder: 'C:\\MyProject or /home/user/project',
      validateInput: (value) => {
        if (!value || value.trim() === '') {
          return 'Please enter a path';
        }
        return null;
      }
    });

    return rootPath?.trim();
  }

  /**
   * Add preset to settings.json
   */
  private static async addPresetToSettings(preset: RegexPreset, rootPath: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('vs-linker');
    const projects = config.get<Project[]>('projects') || [];

    // Add new project
    const newProject: Project = {
      rootPath: rootPath,
      regularExpress: preset.regularExpress,
      autoExtensions: preset.autoExtensions
    };

    projects.push(newProject);

    // Update configuration (save to global settings)
    await config.update('projects', projects, vscode.ConfigurationTarget.Global);
  }

  /**
   * Show all presets (for information)
   */
  static async showAllPresets(): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
      'vsLinkerPresets',
      'VS-Linker Preset List',
      vscode.ViewColumn.One,
      {}
    );

    let html = '<html><body><h1>VS-Linker Regex Presets</h1>';

    REGEX_PRESETS.forEach(preset => {
      html += `
        <h2>${preset.name}</h2>
        <p><strong>Description:</strong> ${preset.description}</p>
        <p><strong>Regex:</strong></p>
        <ul>
          ${preset.regularExpress.map(regex => `<li><code>${this.escapeHtml(regex)}</code></li>`).join('')}
        </ul>
        <p><strong>Examples:</strong></p>
        <ul>
          ${preset.examples.map(example => `<li><code>${this.escapeHtml(example)}</code></li>`).join('')}
        </ul>
        <hr>
      `;
    });

    html += '</body></html>';
    panel.webview.html = html;
  }

  /**
   * HTML escape
   */
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Configuration validation command
   * Validates current vs-linker configuration and generates report
   */
  static async validateConfig(): Promise<void> {
    const config = vscode.workspace.getConfiguration('vs-linker');
    const projects = config.get<Project[]>('projects');

    let report = '=== VS-Linker Configuration Validation Report ===\n\n';
    let hasErrors = false;

    // Check if project configuration exists
    if (!projects || projects.length === 0) {
      report += '❌ No project configuration found.\n';
      report += '   → Add vs-linker.projects setting or use "VS-Linker: Add Regex Preset" command.\n\n';
      hasErrors = true;
    } else {
      report += `✅ Found ${projects.length} project(s) configured.\n\n`;

      // Validate each project
      projects.forEach((project, index) => {
        report += `--- Project #${index + 1} ---\n`;

        // Validate rootPath
        if (!project.rootPath) {
          report += `❌ rootPath is not set.\n`;
          hasErrors = true;
        } else {
          report += `📁 Root Path: ${project.rootPath}\n`;

          // Check if path exists
          if (fs.existsSync(project.rootPath)) {
            report += `   ✅ Path exists.\n`;
          } else {
            report += `   ⚠️  Path does not exist. File links may not work.\n`;
            hasErrors = true;
          }
        }

        // Validate regularExpress
        if (!project.regularExpress || project.regularExpress.length === 0) {
          report += `❌ No regex patterns configured.\n`;
          hasErrors = true;
        } else {
          report += `📝 Regex patterns: ${project.regularExpress.length}\n`;

          project.regularExpress.forEach((regex, regexIndex) => {
            const validation = validateRegex(regex);

            if (validation.valid) {
              report += `   ✅ Regex #${regexIndex + 1}: ${regex.substring(0, 50)}${regex.length > 50 ? '...' : ''}\n`;
            } else {
              report += `   ❌ Regex #${regexIndex + 1}: ${regex}\n`;
              report += `      Error: ${validation.error}\n`;
              hasErrors = true;
            }
          });
        }

        report += '\n';
      });
    }

    // Summary
    report += '=== Validation Complete ===\n';
    if (hasErrors) {
      report += '❌ Some configuration issues found. Please review and fix the errors above.\n';
    } else {
      report += '✅ All configuration is valid!\n';
    }

    // Display in output channel
    const outputChannel = vscode.window.createOutputChannel('VS-Linker Validation');
    outputChannel.clear();
    outputChannel.appendLine(report);
    outputChannel.show();

    // Result message
    if (hasErrors) {
      vscode.window.showWarningMessage('VS-Linker: Validation complete. Issues found. Check Output panel.');
    } else {
      vscode.window.showInformationMessage('VS-Linker: All configuration is valid!');
    }
  }
}
