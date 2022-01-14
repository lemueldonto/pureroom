namespace Grafana {
  interface GrafanaDashboardData {
    url: string,
    title: string,
    description?: string,
    variables?: string[],
  }
}
