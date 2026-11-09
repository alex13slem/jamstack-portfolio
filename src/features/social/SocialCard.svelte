<script lang="ts">
  import { brand } from "@/common/brand";
  import type { SocialCardData } from "./types";
  let {
    siteName,
    domain,
    title,
    description,
    role,
    image,
    project,
    technologies,
  }: SocialCardData = $props();
</script>

<!-- Satori needs inline CSS; style directives keep dynamic values separate. -->
<div
  style="display:flex;position:relative;width:1200px;height:630px;overflow:hidden;font-family:Source Sans, Source Sans Cyrillic;font-weight:600;"
  style:background={brand.background}
  style:color={brand.text}
>
  <div
    style="display:flex;position:absolute;inset:0;background-image:radial-gradient(ellipse at 84% 80%, #6745a355 0%, #090f1600 65%), radial-gradient(ellipse at 68% 0%, #18567e66 0%, #090f1600 64%);"
  ></div>
  <div
    style="display:flex;position:absolute;left:64px;top:44px;font-family:Shadows Into;font-size:46px;line-height:1.3;background-clip:text;color:transparent;"
    style:background-image={brand.gradient}
  >
    {siteName}
  </div>
  <div
    style="display:flex;position:absolute;right:64px;top:64px;font-size:20px;"
    style:color={brand.muted}
  >
    {domain}
  </div>
  <div
    style="display:flex;position:absolute;left:64px;top:170px;flex-direction:column;"
    style:width={`${project ? 558 : 650}px`}
  >
    <div
      style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;line-height:1.08;letter-spacing:-1.4px;"
      style:font-size={`${title.length > 36 ? 48 : 60}px`}
    >
      {title}
    </div>
    {#if project}
      <div
        style="display:flex;margin-top:20px;font-size:24px;"
        style:color={brand.accent}
      >
        {role}
      </div>
    {/if}
    <div
      style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;margin-top:24px;font-size:26px;line-height:1.4;"
      style:color={brand.muted}
    >
      {description}
    </div>
  </div>
  {#if project}
    <div
      style="display:flex;position:absolute;right:54px;top:166px;width:456px;height:342px;border-radius:16px;overflow:hidden;border:1px solid #ffffff26;"
    >
      <img
        src={image}
        alt=""
        width="456"
        height="342"
        style="width:456px;height:342px;object-fit:contain;"
      />
    </div>
  {:else}
    <div
      style="display:flex;position:absolute;right:68px;top:166px;width:300px;height:338px;"
    >
      <img
        src={image}
        alt=""
        width="300"
        height="338"
        style="width:300px;height:338px;object-fit:contain;"
      />
    </div>
  {/if}
  <div
    style="display:flex;position:absolute;left:64px;right:64px;bottom:48px;align-items:center;gap:14px;padding-top:24px;"
  >
    {#each technologies as technology}
      <span
        style="display:flex;font-size:20px;padding:8px 15px;border:1px solid #ffffff22;border-radius:24px;"
        style:color={brand.text}>{technology}</span
      >
    {/each}
  </div>
</div>
