FROM mcr.microsoft.com/devcontainers/ruby:3.4-bookworm

# Default value to allow debug server to serve content over GitHub Codespace's port forwarding service
# The value is a comma-separated list of allowed domains
ENV RAILS_DEVELOPMENT_HOSTS=".githubpreview.dev,.preview.app.github.dev,.app.github.dev"

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# Pre-install matching Bundler version and Ruby LSP
RUN gem install "bundler:>= 4.0.9" ruby-lsp

# Ensure volume mount directories and RVM gem directories are writable by the vscode user
RUN mkdir -p /home/vscode/.bundle /commandhistory \
    && chown -R vscode:rvm /home/vscode/.bundle /commandhistory /usr/local/rvm \
    && chmod -R g+w /usr/local/rvm

# Configure RubyGems to install all user gems into the persistent .bundle volume
ENV GEM_HOME="/home/vscode/.bundle"
ENV GEM_PATH="/home/vscode/.bundle:/usr/local/rvm/gems/default:/usr/local/rvm/gems/default@global"
ENV PATH="/home/vscode/.bundle/bin:${PATH}"

# [Optional] Uncomment this line to install global node packages.
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1
