<script lang="ts">
  interface Props {
    icon: string;
    cssClass?: string;
    dataTestId?: string;
  }

  let { icon, cssClass, dataTestId }: Props = $props();
</script>

<i class="fa fa-{icon} {cssClass}" data-testid={dataTestId}></i>
