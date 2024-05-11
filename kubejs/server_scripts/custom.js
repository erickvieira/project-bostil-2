/**
 * @type {Record<string, (event: any) => void>}
 */
const CUSTOM_RECIPES = {};
/**
 * @enum {string}
 */
const PROCESSES = {
  SEQUENCED_ASSEMBLY: "sequenced_assembly",
};
const nativeMetals = ["iron", "zinc", "lead", "copper", "nickel", "gold"];

/**
 * @param {string} domain
 * @param {string} id
 * @param {number|undefined} count
 * @returns {string}
 */
function buildQuery(domain, id, count) {
  const countLabel = count ? `${count}x ` : "";
  let domainLabel = domain;
  const idLabel = id.replace("#", "");

  if (id.startsWith("#")) {
    domainLabel = `#${domainLabel}`;
  }

  return `${countLabel}${domainLabel}:${idLabel}`;
}

/**
 * @type {Record<string, (id: string, count: number | undefined) => string>}
 */
const DOMAINS = {
  CREATE: (id, count) => buildQuery("create", id, count),
  CREATE_CONNECTED: (id, count) => buildQuery("create_connected", id, count),
  MINECRAFT: (id, count) => buildQuery("minecraft", id, count),
};

// :: copycats :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/**
 * @param {{ domain: "CREATE" | "CREATE_CONNECTED", id: string, count: number }} options
 */
function overrideStoneCuttingCopycatRecipes({ domain, id, count }) {
  return function (event) {
    event.remove({ output: DOMAINS[domain](id) });

    event.stonecutting(
      DOMAINS[domain](id, count),
      DOMAINS.CREATE("andesite_alloy")
    );
  };
}

const copycats = [
  { domain: "CREATE", id: "copycat_step", count: 4 },
  { domain: "CREATE", id: "copycat_panel", count: 4 },
  { domain: "CREATE_CONNECTED", id: "copycat_slab", count: 2 },
  { domain: "CREATE_CONNECTED", id: "copycat_block", count: 1 },
  { domain: "CREATE_CONNECTED", id: "copycat_beam", count: 4 },
  { domain: "CREATE_CONNECTED", id: "copycat_vertical_step", count: 4 },
  { domain: "CREATE_CONNECTED", id: "copycat_stairs", count: 2 },
  { domain: "CREATE_CONNECTED", id: "copycat_fence", count: 4 },
  { domain: "CREATE_CONNECTED", id: "copycat_wall", count: 2 },
  { domain: "CREATE_CONNECTED", id: "copycat_fence_gate", count: 2 },
  { domain: "CREATE_CONNECTED", id: "copycat_board", count: 8 },
  { domain: "CREATE_CONNECTED", id: "copycat_box", count: 1 },
  { domain: "CREATE_CONNECTED", id: "copycat_catwalk", count: 8 },
].forEach((options) => {
  CUSTOM_RECIPES[options.id] = overrideStoneCuttingCopycatRecipes(options);
});

// :: copycats end :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Registering recipes
ServerEvents.recipes((event) => {
  Object.entries(CUSTOM_RECIPES).forEach(([recipeName, customize]) => {
    console.log(`processing [${recipeName}] custom recipe...`);
    customize(event);
    console.log(`[${recipeName}] custom recipe was processed`);
  });
});
