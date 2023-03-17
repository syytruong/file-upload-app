import axios from "axios";

const TOKEN = process.env.NUXT_ENV_ACCESS_TOKEN;

export default {
  async fetchFileList({ commit }) {
    try {
      const response = await axios.get(
        `${process.env.NUXT_ENV_API_ENDPOINT_URL}/files`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      commit(
        "setFileList",
        response?.data?.files?.length ? response.data.files : []
      );
    } catch (error) {
      console.log("error ne");
      console.log(error);
    }
  },
  async uploadFile({ commit }, data) {
    try {
      const response = await axios.post(
        `${process.env.NUXT_ENV_API_ENDPOINT_URL}/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const newFile = response.data.file;
      commit("addNewFile", newFile);
      return newFile;
    } catch (error) {
      return error;
    }
  },
};
