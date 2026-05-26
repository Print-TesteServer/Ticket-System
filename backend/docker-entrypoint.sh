#!/bin/sh
printf '\n'
printf '  ========================================================\n'
printf '   TicketOS — API (Docker, porta 8000)\n'
printf '  ========================================================\n'
printf '   Swagger:   http://localhost:8000/docs\n'
printf '   Health:    http://localhost:8000/health\n'
printf '   Interface: http://localhost/login\n'
printf '  ========================================================\n\n'
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
