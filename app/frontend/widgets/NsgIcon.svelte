<script lang="ts">
  let {
    icon,
    cssClass
  }: {
    icon: string;
    cssClass?: string;
  } = $props();
</script>

<span class="icon icon-{icon} {cssClass}"></span>
