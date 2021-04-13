include config.mk

.PHONY: dev
dev: 
	$(MAKE) -j 2 dev-app dev-tauri

.PHONY: dev-tauri
dev-tauri: 
	$(NODE) $(TAURI_JS_PATH) dev

.PHONY: dev-app
dev-app: 
	cd $(APP_SRC_PATH) && yarn dev

.PHONY: build
build:
	cd $(APP_SRC_PATH) && yarn && yarn build
	$(NODE) $(TAURI_JS_PATH) build

.PHONY: fmt
fmt: 
	$(CARGO) fmt --all --manifest-path=./src-tauri/Cargo.toml
	cd $(APP_SRC_PATH) && yarn lint --fix