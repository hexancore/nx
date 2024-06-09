import type { Plugin } from "vite";

export interface VitePlugin<O extends Record<string, any> = Record<string, any>> {
  id: string,
  factory: (options: O) => Plugin;
  options: O,
  orderIndex: number,
}

export class VitePlugins {
  private plugins: Map<string, VitePlugin>;

  public constructor() {
    this.plugins = new Map();
  }

  public get<O extends Record<string, any> = Record<string, any>>(id: string): VitePlugin<O> {
    const plugin = this.plugins.get(id) as VitePlugin<O>;
    if (!plugin) {
      throw new Error(`VitePlugin '${id}' not registered`);
    }

    return plugin;
  }

  public set(plugin: VitePlugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  public update(pluginsUpdaters: Record<string, (options: any) => any> & { all?: (plugins: VitePlugins) => void; }) {
    for (const id in pluginsUpdaters) {
      if (id !== 'all') {
        this.updateOptions(id, pluginsUpdaters[id]);
      }
    }

    if (pluginsUpdaters.all) {
      pluginsUpdaters.all(this);
    }
  }

  public updateOptions<O extends Record<string, any> = Record<string, any>>(pluginId: string, updater: (options: O) => O): void {
    const plugin = this.get<O>(pluginId);
    plugin.options = updater(plugin.options);
  }

  public build(): Plugin[] {
    return Array.from(this.plugins.values()).sort((a, b) => {
      return a.orderIndex - b.orderIndex;
    }).map((p) => {
      return p.factory(p.options);
    });
  }
}