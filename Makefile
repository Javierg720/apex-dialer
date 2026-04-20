COMPOSE        ?= docker compose
COMPOSE_FILES  ?= -f docker-compose.yml
COMPOSE_DEV    ?= -f docker-compose.yml -f docker-compose.dev.yml

.PHONY: help up up-dev down logs ps build restart \
        migrate migrate-create \
        test test-backend test-dashboard \
        lint lint-backend lint-dashboard \
        fmt fmt-backend fmt-dashboard \
        typecheck gen-types clean nuke

help: ## Show available targets
	@awk 'BEGIN{FS=":.*##"; printf "\nApex Dialer — make targets\n\n"} /^[a-zA-Z_-]+:.*?##/ {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ---- Stack ----

up: ## Build + start the full stack in background
	$(COMPOSE) $(COMPOSE_FILES) up --build -d

up-dev: ## Start the stack with dev overrides (hot reload, exposed ports)
	$(COMPOSE) $(COMPOSE_DEV) up --build

down: ## Stop and remove containers
	$(COMPOSE) $(COMPOSE_FILES) down

logs: ## Follow logs for all services
	$(COMPOSE) $(COMPOSE_FILES) logs -f --tail=200

ps: ## Show running services
	$(COMPOSE) $(COMPOSE_FILES) ps

build: ## Rebuild images without cache
	$(COMPOSE) $(COMPOSE_FILES) build --no-cache

restart: down up ## Restart the stack

# ---- DB ----

migrate: ## Run alembic upgrade head inside backend container
	$(COMPOSE) $(COMPOSE_FILES) run --rm backend alembic upgrade head

migrate-create: ## Create a new revision (usage: make migrate-create M="add foo")
	$(COMPOSE) $(COMPOSE_FILES) run --rm backend alembic revision --autogenerate -m "$(M)"

# ---- Tests ----

test: test-backend test-dashboard ## Run all tests

test-backend:
	cd backend && pytest -q

test-dashboard:
	cd dashboard && npm run lint && npm run typecheck && npm run build

# ---- Lint / format ----

lint: lint-backend lint-dashboard ## Run all linters

lint-backend:
	cd backend && ruff check . && black --check . && mypy .

lint-dashboard:
	cd dashboard && npm run lint

fmt: fmt-backend fmt-dashboard ## Auto-format all code

fmt-backend:
	cd backend && ruff check --fix . && black .

fmt-dashboard:
	cd dashboard && npm run format

typecheck: ## TypeScript typecheck
	cd dashboard && npm run typecheck

# ---- API types ----

gen-types: ## Regenerate packages/api-types from backend OpenAPI
	./scripts/gen-api-types.sh

# ---- Cleanup ----

clean: ## Stop stack and remove named volumes (DESTRUCTIVE)
	$(COMPOSE) $(COMPOSE_FILES) down -v

nuke: clean ## Also remove node_modules, .venv, caches
	rm -rf dashboard/node_modules dashboard/dist
	rm -rf backend/.venv backend/.mypy_cache backend/.ruff_cache backend/.pytest_cache
