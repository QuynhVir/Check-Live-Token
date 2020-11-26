<script>
  import Bulma from "./Bulma.svelte"
  import CopyClipboard from "./CopyClipboard.svelte"

  let accessTokenOnly = false
  let inputTokens = ""
  let liveTokens = ""
  let expiredTokens = ""
  let liveCount = 0
  let expireCount = 0

  const copy = (value) => {
    const app = new CopyClipboard({
      target: document.getElementById("clipboard"),
      props: { value },
    })
    app.$destroy()
  }

  const scan = async () => {
    inputTokens
      .split(/\r?\n/)
      .filter((item) => item.length > 0)
      .map((line) => {
        const token = /EA[\w]{170,210}/.exec(line.trim())[0]
        fetch(`https://graph.facebook.com/v8.0/me?access_token=${token}`)
          .then((response) => response.json())
          .then((data) => {
            if (Object.prototype.hasOwnProperty.call(data, "id")) {
              if (accessTokenOnly) {
                liveTokens = liveTokens + token + "\n"
              } else {
                liveTokens = liveTokens + line.trim() + "\n"
              }
              liveCount++
            } else {
              if (accessTokenOnly) {
                expiredTokens = expiredTokens + token + "\n"
              } else {
                expiredTokens = expiredTokens + line.trim() + "\n"
              }
              expireCount++
            }
          })
      })
  }

  const reset = () => {
    inputTokens = ""
    liveTokens = ""
    expiredTokens = ""
    liveCount = 0
    expireCount = 0
  }
</script>

<style>
  .button {
    height: 1.5em;
  }
</style>

<Bulma />
<main>
  <section class="section">
    <div class="container">
      <h1 class="title">Check Live Facebook Token</h1>
      <p class="subtitle">Facebook token checker written in Svelte.</p>
      <div id="clipboard" />
      <div class="field">
        <div class="columns">
          <div class="column">
            <label for="input-token" class="label">Input token:</label>
          </div>
          <div class="column">
            <label class="checkbox">
              <input
                id="checkbox"
                type="checkbox"
                bind:checked={accessTokenOnly} />
              I just want access_token
            </label>
          </div>
        </div>
        <div class="control">
          <textarea
            class="textarea"
            placeholder="Input your token here"
            data-gramm_editor="false"
            spellcheck="false"
            bind:value={inputTokens}
            autocomplete="off" />
        </div>
      </div>
      <div class="buttons">
        <button class="button is-primary" on:click={scan}>Check</button>
        <button class="button" on:click={reset}>Reset</button>
      </div>
      <div class="field">
        <label class="label" for="live-token">
          {#if liveCount > 0}
            <span class="tag is-success"> Live token: {liveCount}</span>
          {:else}<span class="tag is-success"> Live token: </span>{/if}
        </label>
        <div class="control">
          <textarea
            class="textarea is-success"
            data-gramm_editor="false"
            spellcheck="false"
            autocomplete="off"
            bind:value={liveTokens}
            readonly />
        </div>
      </div>
      <div class="buttons">
        <button class="button" on:click={() => copy(liveTokens)}>Copy to
          clipboard</button>
      </div>
      <div class="field">
        <label class="label" for="expire-token">
          {#if expireCount > 0}
            <span class="tag is-danger"> Expired token: {expireCount}</span>
          {:else}<span class="tag is-danger"> Expired token: </span>{/if}
        </label>
        <div class="control">
          <textarea
            class="textarea is-danger"
            data-gramm_editor="false"
            spellcheck="false"
            autocomplete="off"
            bind:value={expiredTokens}
            readonly />
        </div>
      </div>
      <div class="buttons">
        <button class="button" on:click={() => copy(expiredTokens)}>Copy to
          clipboard</button>
      </div>
    </div>
  </section>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Check Live Token</strong>
        by
        <a href="https://www.facebook.com/QuynhVir">Quynh Vir</a>. The source
        code is licensed
        <a
          href="https://github.com/QuynhVir/Check-Live-Token/blob/master/LICENSE">MIT</a>.
      </p>
    </div>
  </footer>
</main>
