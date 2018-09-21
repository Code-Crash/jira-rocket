export interface _routeParams {
    id: string;
    name: string;
    fullName: string;
    imageUrl: string;
    smallImageUrl: string;
}

export enum EventSource {
    palette = "command_palette",
    info = "info_message",
}

export enum EventType {
    extensionInstalled = "extension_installed",
    vslsShared = "vsls_shared",
    tokenConfigured = "token_configured",
    authStarted = "auth_started"
}

export interface EventProperties {
    source: EventSource | undefined;
}

export interface TelemetryEvent {
    type: EventType;
    time: Date;
    properties: EventProperties;
}