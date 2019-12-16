import {EventManager} from "../event-manager";
import {Client} from "discord.js";
import {UserNoteUpdateEvent} from "./user-note-update-event";
import {UserUpdateEvent} from "./user-update-event";

export class UserEventManager extends EventManager {

    constructor(readonly client: Client) {
        super(client);
    }

    initialiseEvent(): void {
        new UserNoteUpdateEvent(this.getClient()).initialiseEvent();
        new UserUpdateEvent(this.getClient()).initialiseEvent();
    }

}
