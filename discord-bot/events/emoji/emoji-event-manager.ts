import {EventManager} from "../event-manager";
import {Client} from "discord.js";
import {EmojiCreateEvent} from "./emoji-create-event";
import {EmojiDeleteEvent} from "./emoji-delete-event";
import {EmojiUpdateEvent} from "./emoji-update-event";

export class EmojiEventManager extends EventManager {

    constructor(readonly client: Client) {
        super(client);
    }

    initialiseEvent(): void {
        new EmojiCreateEvent(this.getClient()).initialiseEvent();
        new EmojiDeleteEvent(this.getClient()).initialiseEvent();
        new EmojiUpdateEvent(this.getClient()).initialiseEvent();
    }

}
