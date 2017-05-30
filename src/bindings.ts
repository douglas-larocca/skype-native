import { join } from 'path';
import { merge } from 'ramda';
import { sync, async, proxy, Callback } from './binder';

/**
 * Resolves a set of paths relative to the curent directory.
 */
const relative = (...path: string[]) => join(__dirname, ...path);

/**
 * Binding environmnt for our native libs.
 */
const bindingTarget = {
    assemblyFile: relative('../lib/native/win32', 'SkypeClient.dll'),
    references: [relative('../lib/native/win32', 'Microsoft.Lync.Model.dll')],
    typeName: 'SkypeClient.Bindings'
};

const method = (name: string) => merge(bindingTarget, {methodName: name});

const bindSync = <I, O>(methodName: string) => sync<I, O>(method(methodName));

const bindAsync = <I, O>(methodName: string) => async<I, O>(method(methodName));

export const callback = <T>(handler: (input: T) => void): EventSubscription<T> => {
    return {
        callback: proxy(handler)
    };
};

export const startCall = bindSync<CallArgs, void>('Call');
export interface CallArgs {
    uri: string;
    fullscreen: boolean;
    display: number;
}

export const joinMeeting = bindSync<JoinArgs, void>('Join');
export interface JoinArgs {
    url: string;
    fullscreen: boolean;
    display: number;
}

export const hangupAll = bindSync<null, void>('HangupAll');

export const mute = bindSync<MuteArgs, void>('Mute');
export interface MuteArgs {
    state: boolean;
}

export const fullscreen = bindSync<FullscreenArgs, void>('Fullscreen');
export interface FullscreenArgs {
    display: number;
}

export const getActiveUser = bindSync<null, UserDetails>('GetActiveUser');
export interface UserDetails {
    uri: string;
}

export interface EventSubscription<T> {
    callback: (input: T, callback: Callback<void>) => void;
}

export const onIncoming = bindSync<EventSubscription<EventIncomingArgs>, void>('OnIncoming');
export interface EventIncomingArgs {
    inviter: string;
    accept: (kwargs: {fullscreen: boolean, display: number}) => void;
    reject: () => void;
}

export const onConnect = bindSync<EventSubscription<EventConnectedArgs>, void>('OnConnect');
export interface EventConnectedArgs {
    participants: string[];
}

export const onDisconnect = bindSync<EventSubscription<any>, void>('OnDisconnect');

export const onMuteChange = bindSync<EventSubscription<boolean>, void>('OnMuteChange');
