import {Client} from "discord.js";
import {ClientEvents} from "../client-events";

export class GuildMemberUpdateEndpoint extends ClientEvents {

    constructor(readonly client: Client) {
        super(client);
        console.log(`Initialised ${GuildMemberUpdateEndpoint.name}`);
    }

    initialiseEvent(): void {
        this.getClient()
            .on("guildMemberUpdate", (oldMember, newMember) => {

            });
    }

}
