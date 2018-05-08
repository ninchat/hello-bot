#!/usr/bin/env python3

import asyncio
import logging
from typing import Any, Dict, List, Optional

from ninchat.bot.asyncio.main import main

Outgoing = Dict[str, Any]

TRANSFER_QUEUE_ID = ""  # Set this to a Ninchat queue id.

log = logging.getLogger(__name__)


class Handler:

    def __init__(self, output: asyncio.Queue, debug: bool, **kwargs) -> None:
        self._output = output
        self._debug = debug

        log.info("initialized")

    def on_begin(self, user_id: str) -> Optional[List[Outgoing]]:
        """Invoked when a chat starts (user was picked from a queue)."""

        log.info("user %s: chat begun", user_id)

        return [
            {"text": "Hello!"},
        ]

    def on_writing(self, user_id: str, writing: bool) -> None:
        if writing:
            log.info("user %s: started writing", user_id)
        else:
            log.info("user %s: stopped writing", user_id)

    def on_messages(self, user_id: str, messages: List[str]) -> Optional[List[Outgoing]]:
        """Invoked when a message is received, or when messages are
        loaded after reconnection."""

        log.info("user %s: got messages (%d)", user_id, len(messages))

        out = []

        if any(text == "transfer" for text in messages):
            if TRANSFER_QUEUE_ID:
                out.append({"queue_id": TRANSFER_QUEUE_ID})
            else:
                out.append({"text": "Transfer not implemented. Sorry!"})
        else:
            out.append({"text": "Hello! You said: " + messages[0]})

            if len(messages) > 1:
                asyncio.get_event_loop().create_task(self._reply_to(user_id, messages[-1]))

        return out

    def on_close(self, user_id: str) -> None:
        """Invoked when a chat ends (the user quit or timed out)."""

        log.info("user %s: chat ended", user_id)

    async def _reply_to(self, user_id: str, incoming_text: str) -> None:
        outgoing = {"text": "You also said: " + incoming_text}
        await self._output.put((user_id, outgoing))


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    main(Handler)
