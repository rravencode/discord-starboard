import { MessageReaction, PartialMessageReaction } from 'discord.js';

export const isClicked = (reaction: MessageReaction | PartialMessageReaction, emojiId: string): boolean => {
    return reaction.emoji.id === emojiId;
};