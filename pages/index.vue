<script setup lang="ts">
const data = ref([]);

const option = ref("491,492,493,627,628,629");
const password = ref("Duval@123");
const email = ref("flquckselltasks@gmail.com");
const page = ref(1);
const record = ref(2);
const perPage = ref(3);
const lastCase = ref("");
const headless = ref(false);
const proxy = ref(true);
const proxyURL = ref(
  "http://customer-Standerpm:MPStander3@us-pr.oxylabs.io:10000"
);

const getData = async (
  option: string,
  password: string,
  email: string,
  page: number,
  record: number,
  perPage: number,
  lastCase: string,
  headless: boolean,
  proxy: boolean,
  proxyURL: string
) => {
  const res: any = await useFetch("/api/duval", {
    method: "POST",
    body: {
      option: option,
      password: password,
      email: email,
      page: page,
      perPage: perPage,
      lastCase: lastCase,
      headless: headless,
      proxy: proxy,
      proxyURL: proxyURL || "",
      record: record,
    },
  });
  console.log(res.data.value);
  data.value = res.data.value;
  return res.data;
};
</script>

<template>
  <div>
    <button
      @click.prevent="
        getData(
          option,
          password,
          email,
          page,
          record,
          perPage,
          lastCase,
          headless,
          proxy,
          proxyURL
        )
      "
    >
      GET DATA
    </button>

    <div v-for="(dt, index) in data" :key="index">
      <p>CaseNumber: {{ dt.duval.caseNumber }}</p>
      <pre>{{ dt }}</pre>
    </div>
  </div>
</template>