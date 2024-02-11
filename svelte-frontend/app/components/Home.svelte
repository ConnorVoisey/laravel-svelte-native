<script lang="ts">
  import { navigate } from "svelte-native";
  import { logout, userProfile } from "~/stores/user";
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";

  let message: string = "Blank Svelte Native App";
</script>

<page>
  <actionBar title="Home" />
  <gridLayout>
    <stackLayout row="0" horizontalAlignment="left">
      <label class="info">
        <formattedString>
          <span class="fas" text="&#xf135;" />
          <span text=" {message}" />
        </formattedString>
      </label>
      {#if $userProfile !== null}
        <label class="info">
          <formattedString>
            <span text={$userProfile?.name} />
          </formattedString>
        </label>
        <label>
          <formattedString>
            <span text={$userProfile?.email} />
          </formattedString>
        </label>

        <button text="Logout" on:tap={logout} class="btn m-t-20" />
      {:else}
        <button
          text="Login"
          on:tap={() => navigate({ page: Login })}
          class="btn m-t-20 -primary"
        />
        <button
          text="Register"
          on:tap={() => navigate({ page: Register })}
          class="btn m-t-20 -primary"
        />
      {/if}
    </stackLayout>
  </gridLayout>
</page>

<style>
  .info .fas {
    color: #3a53ff;
  }

  .info {
    font-size: 20;
    horizontal-align: center;
    vertical-align: center;
  }
</style>
