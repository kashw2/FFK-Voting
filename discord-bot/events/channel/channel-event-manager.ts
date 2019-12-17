import {Client} from "discord.js";
import {EventManager} from "../event-manager";
import {ChannelCreateEvent} from "./events/channel-create-event";
import {ChannelDeleteEvent} from "./events/channel-delete-event";
import {ChannelPinsUpdateEvent} from "./events/channel-pins-update-event";
import {ChannelUpdateEvent} from "./events/channel-update-event";

export class ChannelEventManager extends EventManager {

    constructor(readonly client: Client) {
        super(client);
    }

    initialiseEvent(): void {
        new ChannelCreateEvent(this.getClient()).initialiseEvent();
        new ChannelDeleteEvent(this.getClient()).initialiseEvent();
        new ChannelPinsUpdateEvent(this.getClient()).initialiseEvent();
        new ChannelUpdateEvent(this.getClient()).initialiseEvent();
    }

}
